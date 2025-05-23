import { type IPoint, type IPolyline } from '@esri/arcgis-rest-request';

export type FeedbackSubmission = {
  email: string;
  feedback: string;
  feature: {
    attributes: Record<string, unknown>;
    geometry: IPoint | IPolyline;
  };
  layer?: string;
  name?: string;
  url: string;
};

export type FeedbackResponse = {
  success: boolean;
  errorMessage?: string;
};
