import React from "react";
import Link from "next/link";

const ListOfGroups = ({ className, groups, totalOwed, userId }) => {
  console.log(groups);
  console.log(totalOwed);
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Groups:</h2>
      <div className="border-2 border-black p-4 rounded-lg">
        {" "}
        {/* Outer container with black border wrapping only group elements */}
        {Object.keys(groups)
          .filter((groupId) => {
            const group = groups[groupId];
            return group.users.some(
              (member) => member.user_id === userId.toString()
            );
          })
          .map((groupId) => {
            const group = groups[groupId];
            const owedAmount = totalOwed[group.group_id] || 0;

            return (
              <div
                key={groupId}
                className="mb-4 p-4 rounded border border-gray-300 bg-yellow-100 shadow-md" // Light yellow background and shadow
              >
                <Link href={`/groups`}>
                  <div
                    className="flex justify-between items-center"
                    onClick={() => {
                      localStorage.setItem("selectedGroupId", group.group_id);
                    }}
                  >
                    <h3 className="text-lg font-semibold">
                      {group.group_name}
                    </h3>
                    <p className="text-sm">
                      {owedAmount === 0
                        ? "$0.00"
                        : `${owedAmount > 0 ? "+" : "-"} $${Math.abs(
                            owedAmount
                          ).toFixed(2)}`}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListOfGroups;
