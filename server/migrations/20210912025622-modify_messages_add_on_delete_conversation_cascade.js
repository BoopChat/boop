'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Messages',
      'Messages_conversation_id_fkey'
    );
    await queryInterface.addConstraint('Messages', {
      fields: ['conversation_id'],
      type: 'foreign key',
      name: 'Messages_conversation_id_fkey',
      references: {
        table: 'Conversations',
        field: 'id',
      },
      onDelete: 'CASCADE'
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Messages',
      'Messages_conversation_id_fkey'
    );
    await queryInterface.addConstraint('Messages', {
      fields: ['conversation_id'],
      type: 'foreign key',
      name: 'Messages_conversation_id_fkey',
      references: {
        table: 'Conversations',
        field: 'id',
      }
    });
  }
};
