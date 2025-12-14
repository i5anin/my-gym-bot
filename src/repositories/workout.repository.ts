import type { Workout } from '@/domain/workout.types';

/**
 * Репозиторий сохранения завершённых тренировок.
 */
export class WorkoutRepository {
  /**
   * Сохраняет тренировку для указанного чата.
   * @param chatId
   * @param workout
   */
  save(chatId: number, workout: Workout): void {
    this.validate(chatId, workout);
    this.persist(chatId, workout);
  }

  /**
   * Выполняет фактическое сохранение в конкретном хранилище.
   * @param chatId
   * @param workout
   */
  protected persist(chatId: number, workout: Workout): void {
    throw new Error(
      `WorkoutRepository.persist not implemented: ${chatId}, ${workout.date}`,
    );
  }

  /**
   * Проверяет инварианты входных данных перед сохранением.
   * @param chatId
   * @param workout
   */
  private validate(chatId: number, workout: Workout): void {
    if (!Number.isInteger(chatId)) {
      throw new Error('chatId must be integer');
    }
    if (workout.exercises.length === 0) {
      throw new Error('Workout must contain exercises');
    }
  }
}
