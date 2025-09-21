import React from 'react';
import { AppLayout } from '../../components/layouts/AppLayout';
import type { VerificationRequestShowProps } from '../../types/verification_request';

const Show: React.FC<VerificationRequestShowProps> = ({
  verificationRequest,
}) => {
  return (
    <AppLayout title="Verification Request Details">
      <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Verification Request Details
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Request Status
            </h2>
            <p
              className={`text-lg font-bold capitalize ${verificationRequest.status === 'approved' ? 'text-green-600' : verificationRequest.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}
            >
              {verificationRequest.status}
            </p>
          </div>

          {verificationRequest.notes && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Notes
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {verificationRequest.notes}
              </p>
            </div>
          )}

          {verificationRequest.supplier && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Submitted By
              </h2>
              <p className="text-gray-700">
                {verificationRequest.supplier.email}
              </p>
            </div>
          )}

          {verificationRequest.created_at && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Submitted On
              </h2>
              <p className="text-gray-700">
                {new Date(verificationRequest.created_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {verificationRequest.documents &&
            verificationRequest.documents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verificationRequest.documents.map((docUrl, index) => (
                    <a
                      key={index}
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all text-blue-600 hover:text-blue-800"
                    >
                      Document {index + 1} (Click to view)
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;
