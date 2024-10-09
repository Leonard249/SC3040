Create Expense
POST
```v1/expense```
```
{
  "group": "group_name",
  "items": [
    {
      "name": "item_name",
      "cost": "$5.00",
      "users": [
        "user_id1",
        "user_id2",
        "user_id3"
      ],
      "settled": "FALSE"
    },
    {
      "name": "item_name2",
      "cost": "$2.00",
      "users": [
        "user_id1"
      ],
      "settled": "TRUE"
    }
  ]
}
```
Edit Expense
PUT
```v1/expense/{group_id}```
```
{
  "group": "group_name",
  "items": [
    {
      "name": "item_name",
      "cost": "$5.00",
      "users": [
        "user_id1",
        "user_id2",
        "user_id3"
      ],
      "settled": "FALSE"
    },
    {
      "name": "item_name2",
      "cost": "$2.00",
      "users": [
        "user_id1"
      ],
      "settled": "TRUE"
    }
  ]
}
```

Bill Summary
GET
```v1/expense/{group_id}```
```
{
  "group": "group_name",
  "expenseId": "67053dd0cb8d604f40a8f0c4"
  "items": [
    {
      "name": "item_name",
      "cost": "$5.00",
      "users": [
        "user_id1",
        "user_id2",
        "user_id3"
      ],
      "settled": "FALSE"
    },
    {
      "name": "item_name2",
      "cost": "$2.00",
      "users": [
        "user_id1"
      ],
      "settled": "TRUE"
    }
  ]
}
```