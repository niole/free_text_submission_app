import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    define: {
        freezeTableName: true,
    }
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

export const MetricDbModel = sequelize.define('Metric', {
    createdAt: DataTypes.DATE,
    name: DataTypes.STRING,
    subjectLabel: { type: DataTypes.STRING, allowNull: true },
    targetLabel: { type: DataTypes.STRING, allowNull: true },
});

export const AnswerDbModel = sequelize.define('Answer', {
    createdAt: DataTypes.DATE,
    id: { type: DataTypes.STRING, unique: true, primaryKey: true },
    pairId: DataTypes.STRING,
    email: DataTypes.STRING,
    answer: DataTypes.STRING,
    correct: DataTypes.BOOLEAN,
});
AnswerDbModel.belongsTo(QuestionAnswerPairDbModel, { targetKey: 'id', foreignKey: 'pairId' });

await sequelize.sync();

// put teacher in DB
const found = await UserDbModel.findOne({ id: 'me'});
if (!found) {
    await UserDbModel.create({ id: 'me', email: import.meta.env.VITE_TEACHER_EMAIL });
}

export { UserDbModel, QuestionAnswerPairDbModel };