import { addFeatures } from '@esri/arcgis-rest-feature-service';
import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
import sgMail from '@sendgrid/mail';
import * as logger from 'firebase-functions/logger';
import { defineSecret, defineString } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import type {
  FeedbackResponse,
  FeedbackSubmission,
} from '../../shared/types.js';

// secrets
const clientId = defineSecret('AGOL_CLIENT_ID');
const clientSecret = defineSecret('AGOL_CLIENT_SECRET');
const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

// environment variables
const pointFeatureService = defineString('POINT_FEATURE_SERVICE');
const lineFeatureService = defineString('LINE_FEATURE_SERVICE');
const feedbackEmail = defineString('FEEDBACK_EMAIL');

let appManager: ApplicationCredentialsManager;

const NO_REPLY_EMAIL = 'noreply@utah.gov';

export const submitFeedback = onCall<
  FeedbackSubmission,
  Promise<FeedbackResponse>
>(
  {
    cors: [/bikeways(\.dev)?\.utah\.gov/],
    secrets: [clientId, clientSecret, sendgridApiKey],
  },
  async ({ data }) => {
    logger.info('adding new feature to feature service', data);

    if (!appManager) {
      appManager = ApplicationCredentialsManager.fromCredentials({
        clientId: clientId.value(),
        clientSecret: clientSecret.value(),
      });
    }

    sgMail.setApiKey(sendgridApiKey.value());

    let response;
    let featureServiceUrl;
    if (data.feature.geometry && 'x' in data.feature.geometry) {
      // point
      featureServiceUrl = pointFeatureService.value();
      response = await addFeatures({
        url: featureServiceUrl,
        authentication: appManager,
        features: [
          {
            geometry: data.feature.geometry,
            attributes: {
              SubmitterEmail: data.email,
              Feedback: data.feedback,
              Status: 'Submitted',
            },
          },
        ],
      });
    } else {
      // line
      featureServiceUrl = lineFeatureService.value();
      response = await addFeatures({
        url: featureServiceUrl,
        authentication: appManager,
        features: [
          {
            geometry: data.feature.geometry,
            attributes: {
              SubmitterEmail: data.email,
              Feedback: data.feedback,
              Status: 'Submitted',
              Layer: data.layer,
              FeatureName: data.name,
              RelatedFeature: JSON.stringify(data.feature.attributes),
            },
          },
        ],
      });
    }

    if (!response.addResults[0]?.success) {
      logger.error('Failed to add feature to AGOL feature service', response);
      throw new HttpsError(
        'internal',
        'Failed to add feature to AGOL feature service',
      );
    }

    logger.info('Feature added successfully', response.addResults[0]);

    if (data.email) {
      try {
        await sgMail.send({
          to: data.email,
          from: NO_REPLY_EMAIL,
          templateId: 'd-fabcd56c0cbe401a82909750847711a7',
          dynamicTemplateData: {
            feedback: data.feedback,
            name: data.name,
            url: data.url,
          },
        });
      } catch (error) {
        logger.error('Failed to send email', error);
        throw new HttpsError('internal', 'Failed to send email');
      }
      logger.info('Feedback confirmation email sent successfully');
    }

    try {
      await sgMail.send({
        to: feedbackEmail.value(),
        from: NO_REPLY_EMAIL,
        templateId: 'd-8d93857b80bc4d0292c22863a85d6763',
        dynamicTemplateData: {
          feedback: data.feedback,
          email: data.email,
          name: data.name,
          url: data.url,
          layer: data.layer,
          attributes: JSON.stringify(data.feature.attributes, null, 2),
          feedbackRecord: {
            url: featureServiceUrl,
            objectId: response.addResults[0].objectId,
            globalId: response.addResults[0].globalId,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to send feedback notification email', error);
      throw new HttpsError('internal', 'Failed to send notification email');
    }

    return { success: true };
  },
);
