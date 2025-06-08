import { Form } from "react-router";
import InputPair from "~/components/input-pair";
import { Button } from "~/components/ui/button";

export default function SubmitReviewPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Submit a Review</h1>
      <Form>
        <InputPair
          label="Title"
          description="The title of your review"
          name="title"
          id="title"
        />
        <InputPair
          label="Description"
          description="The description of your review"
          name="description"
          id="description"
        />
        <InputPair
          label="Image"
          description="The image of your review"
          name="image"
          id="image"
        />
        <Button>Submit</Button>
      </Form>
    </div>
  );
}
