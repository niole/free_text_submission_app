import { json } from '@sveltejs/kit'
import { deleteQuestionAnswerPair } from '$lib/server/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function DELETE(event) {
  console.debug('Deleting question');
  await handleTeacherRoute(event);
  const { id } = event.params;

  console.debug('Deleting question ', id);

  await deleteQuestionAnswerPair(id);
  return json({ success: true });
}