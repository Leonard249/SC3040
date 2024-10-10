export const GROUP_USER_ITEM = {
  message: "Successfully Retrieve",
  data: {
    groups: [
      {
        group_id: "group_id_1",
        users: [
          {
            user_id: "6706087b1143dcab37a70f34",
            memberName: "Alice",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c4",
                item: "example_item_1",
                amount: 1.75,
                paid_by: "6706087b1143dcab37a70f35", // Changed to Bob
              },
              {
                id: "67053dd0cb8d604f40a8f0c5",
                item: "example_item_2",
                amount: 3.4,
                paid_by: "6706087b1143dcab37a70f34", // Changed to Alice
              },
              {
                id: "67053dd0cb8d604f40a8f0c6",
                item: "example_item_3",
                amount: 2.9,
                paid_by: "6706087b1143dcab37a70f36", // Changed to Charlie
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f35",
            memberName: "Bob",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c7",
                item: "item_4",
                amount: 6.5,
                paid_by: "6706087b1143dcab37a70f36", // Changed to Charlie
              },
              {
                id: "67053dd0cb8d604f40a8f0c8",
                item: "item_5",
                amount: 8.25,
                paid_by: "6706087b1143dcab37a70f34", // Changed to Alice
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f36",
            memberName: "Charlie",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c9",
                item: "item_6",
                amount: 5.0,
                paid_by: "6706087b1143dcab37a70f35", // Changed to Bob
              },
              {
                id: "67053dd0cb8d604f40a8f0ca",
                item: "item_7",
                amount: 7.8,
                paid_by: "6706087b1143dcab37a70f34", // Changed to Alice
              },
            ],
          },
        ],
      },
      {
        group_id: "group_id_2",
        users: [
          {
            user_id: "6706087b1143dcab37a70f37",
            memberName: "David",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0cb",
                item: "item_8",
                amount: 11.25,
                paid_by: "6706087b1143dcab37a70f38", // Changed to Eva
              },
              {
                id: "67053dd0cb8d604f40a8f0cc",
                item: "item_9",
                amount: 14.0,
                paid_by: "6706087b1143dcab37a70f37", // Changed to David
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f38",
            memberName: "Eva",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0cd",
                item: "item_10",
                amount: 9.5,
                paid_by: "6706087b1143dcab37a70f37", // Changed to David
              },
            ],
          },
        ],
      },
      {
        group_id: "group_id_3",
        users: [
          {
            user_id: "6706087b1143dcab37a70f36",
            memberName: "Charlie",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c9",
                item: "item_6",
                amount: 5.25,
                paid_by: "6706087b1143dcab37a70f38", // Changed to Eva
              },
              {
                id: "67053dd0cb8d604f40a8f0ca",
                item: "item_7",
                amount: 8.6,
                paid_by: "6706087b1143dcab37a70f37", // Changed to David
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f38",
            memberName: "Eva",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0cd",
                item: "item_10",
                amount: 10.75,
                paid_by: "6706087b1143dcab37a70f36", // Changed to Charlie
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f37",
            memberName: "David",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0cb",
                item: "item_8",
                amount: 12.0,
                paid_by: "6706087b1143dcab37a70f38", // Changed to Eva
              },
              {
                id: "67053dd0cb8d604f40a8f0cc",
                item: "item_9",
                amount: 15.3,
                paid_by: "6706087b1143dcab37a70f36", // Changed to Charlie
              },
            ],
          },
        ],
      },
      {
        group_id: "group_id_4",
        users: [
          {
            user_id: "6706087b1143dcab37a70f34",
            memberName: "Alice",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c4",
                item: "example_item_1",
                amount: 2.1,
                paid_by: "6706087b1143dcab37a70f35", // Changed to Bob
              },
              {
                id: "67053dd0cb8d604f40a8f0c5",
                item: "example_item_2",
                amount: 3.75,
                paid_by: "6706087b1143dcab37a70f36", // Changed to Charlie
              },
              {
                id: "67053dd0cb8d604f40a8f0c6",
                item: "example_item_3",
                amount: 4.85,
                paid_by: "6706087b1143dcab37a70f34", // Changed to Alice
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f35",
            memberName: "Bob",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0c7",
                item: "item_4",
                amount: 5.9,
                paid_by: "6706087b1143dcab37a70f34", // Changed to Alice
              },
              {
                id: "67053dd0cb8d604f40a8f0c8",
                item: "item_5",
                amount: 8.5,
                paid_by: "6706087b1143dcab37a70f37", // Changed to David
              },
            ],
          },
          {
            user_id: "6706087b1143dcab37a70f37",
            memberName: "David",
            items: [
              {
                id: "67053dd0cb8d604f40a8f0cb",
                item: "item_8",
                amount: 11.0,
                paid_by: "6706087b1143dcab37a70f35", // Changed to Bob
              },
              {
                id: "67053dd0cb8d604f40a8f0cc",
                item: "item_9",
                amount: 13.75,
                paid_by: "6706087b1143dcab37a70f37", // Changed to David
              },
            ],
          },
        ],
      },
    ],
  },
};

export const ALL_USERS = {
  message: "Successfully Retrieve",
  data: [
    {
      _id: "6706087b1143dcab37a70f34",
      email: "user@example.com",
      username: "Alice",
    },
    {
      _id: "6706087b1143dcab37a70f35",
      email: "user3@example.com",
      username: "Bob",
    },
    {
      _id: "6706087b1143dcab37a70f36",
      email: "user2@example.com",
      username: "Charlie",
    },
    {
      _id: "6706087b1143dcab37a70f37",
      email: "user1@example.com",
      username: "David",
    },
    {
      _id: "6706087b1143dcab37a70f38",
      email: "user4@example.com",
      username: "Eva",
    },
  ],
};
