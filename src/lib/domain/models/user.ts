import * as sequelize from 'sequelize';
import * as db from './db';
import { type UserModel } from '$lib/types';

export async function listStudents(): Promise<UserModel[]> {
    const metrics = await db.MetricDbModel.findAll({
        attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('email')), 'email'],
            'email',
        ],
    });
   
    return metrics.map(x => ({ email: x.toJSON().email }));
}