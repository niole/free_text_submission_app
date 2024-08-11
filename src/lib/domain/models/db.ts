import { v4 } from 'uuid';
import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
});

const UserDbModel = sequelize.define('User', {
    id: { type: DataTypes.STRING, unique: true, primaryKey: true },
    email: DataTypes.STRING,
});

const QuestionAnswerPairDbModel = sequelize.define('QuestionAnswerPair', {
    id: { type: DataTypes.STRING, unique: true, primaryKey: true },
    ownerId: DataTypes.STRING,
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    link: { type: DataTypes.STRING, unique: true },
});
QuestionAnswerPairDbModel.belongsTo(UserDbModel, { targetKey: 'id', foreignKey: 'ownerId' });

const AnswerDbModel = sequelize.define('Answer', {
    createdAt: DataTypes.DATE,
    id: { type: DataTypes.STRING, unique: true, primaryKey: true },
    pairId: DataTypes.STRING,
    email: DataTypes.STRING,
    answer: DataTypes.STRING,
    correct: DataTypes.BOOLEAN,
});
AnswerDbModel.belongsTo(QuestionAnswerPairDbModel, { targetKey: 'id', foreignKey: 'pairId' });

const MetricDbModel = sequelize.define('Metric', {
    createdAt: DataTypes.DATE,
    name: DataTypes.STRING,
    userId: { type: DataTypes.STRING, allowNull: true },
    answerId: { type: DataTypes.STRING, allowNull: true },
    pairId: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
});
MetricDbModel.belongsTo(UserDbModel, { targetKey: 'id', foreignKey: { allowNull: true, name: 'userId' } });
MetricDbModel.belongsTo(AnswerDbModel, { targetKey: 'id', foreignKey: { allowNull: true, name: 'answerId' } });
MetricDbModel.belongsTo(QuestionAnswerPairDbModel, { targetKey: 'id', foreignKey: { allowNull: true, name: 'pairId' } });

await sequelize.sync();

// put teacher in DB
const found = await UserDbModel.findOne({ where: { email: import.meta.env.VITE_TEACHER_EMAIL } });
if (!found) {
    await UserDbModel.create({ id: v4(), email: import.meta.env.VITE_TEACHER_EMAIL });
}

export { UserDbModel, QuestionAnswerPairDbModel, MetricDbModel, AnswerDbModel };