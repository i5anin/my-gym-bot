import type { WorkoutSession } from '@/domain/workout.types';

/**
 * Репозиторий управления активными сессиями тренировок.
 */
export class WorkoutSessionRepository {
  /**
   * Возвращает активную сессию тренировки для чата.
   * @param chatId
   */
  get(chatId: number): WorkoutSession | null {
    throw new Error(`WorkoutSessionRepository.get not implemented: ${chatId}`);
  }

  /**
   * Сохраняет или обновляет активную сессию тренировки.
   * @param chatId
   * @param session
   */
  save(chatId: number, session: WorkoutSession): void {
    throw new Error(
      `WorkoutSessionRepository.save not implemented: ${chatId}, ${session.step}`,
    );
  }

  /**
   * Удаляет активную сессию тренировки для чата.
   * @param chatId
   */
  remove(chatId: number): void {
    throw new Error(
      `WorkoutSessionRepository.remove not implemented: ${chatId}`,
    );
  }
}
