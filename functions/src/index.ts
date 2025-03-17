import { addFeatures } from '@esri/arcgis-rest-feature-service';
import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
import * as logger from 'firebase-functions/logger';
import { defineSecret, defineString } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import type {
  FeedbackResponse,
  FeedbackSubmission,
} from '../../shared/types.js';

const clientId = defineSecret('AGOL_CLIENT_ID');
const clientSecret = defineSecret('AGOL_CLIENT_SECRET');
const pointFeatureService = defineString('POINT_FEATURE_SERVICE');
const lineFeatureService = defineString('LINE_FEATURE_SERVICE');

let appManager: ApplicationCredentialsManager;

export const submitFeedback = onCall<
  FeedbackSubmission,
  Promise<FeedbackResponse>
>(
  {
    cors: [/bikeways(\.dev)?\.utah\.gov/],
    secrets: [clientId, clientSecret],
  },
  async ({ data }) => {
    logger.info('adding new feature to feature service', data);

    if (!appManager) {
      appManager = ApplicationCredentialsManager.fromCredentials({
        clientId: clientId.value(),
        clientSecret: clientSecret.value(),
      });
    }

    const response = await addFeatures({
      url: lineFeatureService.value(),
      authentication: appManager,
      features: [
        {
          geometry: data.selectedFeature.geometry,
          attributes: {
            SubmitterEmail: data.email,
            Feedback: data.feedback,
            Status: 'Submitted',
            Layer: data.layer,
            FeatureName: data.name,
            RelatedFeature: JSON.stringify(data.selectedFeature.attributes),
          },
        },
      ],
    });

    if (!response.addResults[0]?.success) {
      logger.error('Failed to add feature to AGOL feature service', response);
      throw new HttpsError(
        'internal',
        'Failed to add feature to AGOL feature service',
      );
    }

    logger.info('Feature added successfully', response.addResults[0]);

    return { success: true };
  },
);
