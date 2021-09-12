'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Participants',
      'Participants_conversation_id_fkey'
    );
    await queryInterface.addConstraint('Participants', {
      fields: ['conversation_id'],
      type: 'foreign key',
      name: 'Participants_conversation_id_fkey',
      references: {
        table: 'Conversations',
        field: 'id',
      },
      onDelete: 'CASCADE'
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Participants',
      'Participants_conversation_id_fkey'
    );
    await queryInterface.addConstraint('Participants', {
      fields: ['conversation_id'],
      type: 'foreign key',
      name: 'Participants_conversation_id_fkey',
      references: {
        table: 'Conversations',
        field: 'id',
      }
    });
  }
};
