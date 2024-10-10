"use client"
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { groupName, accountId, memberName } = req.body;

    const filePath = path.join(process.cwd(), 'public/aswe.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!jsonData[groupName]) {
      jsonData[groupName] = {};
    }

    const newMemberKey = `member${Object.keys(jsonData[groupName]).length + 1}`;
    jsonData[groupName][newMemberKey] = {
      account_id: parseInt(accountId),
      items: []  // Empty items list initially
    };

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    return res.status(200).json({ message: 'Group and member added successfully.' });
  } else {
    return res.status(405).json({ message: 'Method not allowed.' });
  }
}
