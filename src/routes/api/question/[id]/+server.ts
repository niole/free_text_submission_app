import { json } from '@sveltejs/kit'
import { deleteQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';

export async function DELETE(event) {
  const { id } = event.params;
  await deleteQuestionAnswerPair(id);
  return json({ success: true });
}