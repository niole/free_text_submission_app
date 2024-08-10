import { json } from '@sveltejs/kit'
import { deleteQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function DELETE(event) {
  await handleTeacherRoute(event);
  const { id } = event.params;
  await deleteQuestionAnswerPair(id);
  return json({ success: true });
}