import * as sequelize from 'sequelize';
import * as db from './db';
import { type UserModel } from '$lib/types';
import { TEACHER_EMAIL } from '$env/static/private';

export async function listStudents(): Promise<UserModel[]> {
    const metrics = await db.MetricDbModel.findAll({
        attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('email')), 'email'],
            'email',
        ],
    });
   
    return metrics.map(x => ({ email: x.toJSON().email }));
}

export async function getTeacher(): Promise<UserModel | undefined> {
    const user = await db.UserDbModel.findOne({ where: { email: TEACHER_EMAIL } });
    return user?.toJSON();
}