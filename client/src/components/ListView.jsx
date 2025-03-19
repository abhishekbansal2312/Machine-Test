import React from "react";

const ListView = ({ lists }) => {
  if (!lists || lists.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-md shadow-md">
        No lists found. Upload a list to distribute to agents.
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-6">
      {lists.map((list) => (
        <div
          key={list._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200"
        >
          <div className="px-6 py-4 bg-blue-50 border-b">
            <h3 className="text-xl font-semibold text-gray-800">
              List Details
            </h3>
            <p className="text-sm text-gray-600">
              Uploaded on {formatDate(list.createdAt)}
            </p>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-semibold text-gray-700">Agent</dt>
                <dd className="text-gray-900">{list.agentId?.name || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-700">
                  Uploaded By
                </dt>
                <dd className="text-gray-900">
                  {list.uploadedBy?.email || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-700">
                  Number of Items
                </dt>
                <dd className="text-gray-900">{list.items?.length || 0}</dd>
              </div>
            </dl>
          </div>

          <div className="px-6 pb-4">
            <h4 className="text-lg font-medium text-gray-800 mb-3">
              List Items
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      First Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.items &&
                    list.items.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-gray-900 border-b">
                          {item.firstName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 border-b">
                          {item.phone}
                        </td>
                        <td className="px-4 py-3 text-gray-600 border-b">
                          {item.notes}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
