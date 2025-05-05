import { useMutation } from '@tanstack/react-query';
import {
  Banner,
  Button,
  TextArea,
  TextField,
  useFirebaseAnalytics,
  useFirebaseFunctions,
} from '@ugrc/utah-design-system';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useRef, useState } from 'react';
import type { FeedbackResponse, FeedbackSubmission } from '../../shared/types';

type FeedbackProps = {
  onCancel: () => void;
  graphic?: __esri.Graphic;
  genericPoint?: __esri.Graphic;
};
export default function Feedback({
  onCancel,
  graphic,
  genericPoint,
}: FeedbackProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const { functions } = useFirebaseFunctions();
  const submitFeedbackCallable = httpsCallable<
    FeedbackSubmission,
    FeedbackResponse
  >(functions, 'submitFeedback');

  const logEvent = useFirebaseAnalytics();
  const submitFeedback = async (data: FeedbackSubmission) => {
    logEvent('submit_feedback');
    const response = await submitFeedbackCallable(data);
    if (!response.data.success) {
      throw new Error(response.data.errorMessage);
    }
  };

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onError: (error) => {
      console.error('error with call to function', error);
    },
  });

  // scroll into view
  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({
      email,
      feedback,
      feature: graphic ? graphic.toJSON() : genericPoint!.toJSON(),
      layer: graphic?.layer?.title ?? undefined,
      name:
        graphic?.layer &&
        graphic.attributes[
          (graphic.layer! as __esri.FeatureLayer).displayField!
        ],
      url: window.location.href,
    });
  };

  if (mutation.isSuccess) {
    return (
      <>
        <p>
          Thank you for your feedback! If you provided an email address, you
          should receive a confirmation email shortly.
        </p>
        <div className="mt-2 flex justify-end">
          <Button onPress={onCancel}>Close</Button>
        </div>
      </>
    );
  }

  return (
    <>
      {mutation.isError && (
        <Banner>
          There was an error submitting your feedback. Please try again later.
        </Banner>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Your email (optional)"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <TextArea
          label="Feedback"
          isRequired
          value={feedback}
          onChange={setFeedback}
          maxLength={10000}
        />
        <div ref={buttonContainerRef} className="flex justify-end space-x-2">
          <Button variant="secondary" onPress={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isDisabled={mutation.isPending}>
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
