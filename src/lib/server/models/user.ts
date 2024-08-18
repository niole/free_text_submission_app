import * as sequelize from 'sequelize';
import * as db from './db';
import { type UserModel } from '$lib/types';
import { TEACHER_EMAIL } from '$env/static/private';

export async function listStudents(limit: number, query?: string): Promise<UserModel[]> {
    const dbQuery = {
        attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('email')), 'email'],
            'email',
        ],
        limit,
    };

    if (query) {
        const textSearchQuery = {
            [sequelize.Op.like]: `%${query}%`,
        };

        dbQuery.where = {
            email: textSearchQuery
        };
    }


    const metrics = await db.MetricDbModel.findAll(dbQuery);

    return metrics.map(x => ({ email: x.toJSON().email }));
}

export async function getTeacher(): Promise<UserModel | undefined> {
    const user = await db.UserDbModel.findOne({ where: { email: TEACHER_EMAIL } });
    return user?.toJSON();
}
