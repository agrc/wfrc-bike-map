import { type IPoint, type IPolyline } from '@esri/arcgis-rest-request';

export type FeedbackSubmission = {
  email: string;
  feedback: string;
  feature: {
    attributes: Record<string, any>;
    geometry: IPoint | IPolyline;
  };
  layer?: string;
  name?: string;
};

export type FeedbackResponse = {
  success: boolean;
  errorMessage?: string;
};
