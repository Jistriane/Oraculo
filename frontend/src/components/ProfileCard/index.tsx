import React, { useState } from 'react';
import { Profile } from '../../types/profile';
import { starChainService } from '../../services/starchain';

interface ProfileCardProps {
  profile: Profile;
  isAuthenticated: boolean;
  isOwnProfile?: boolean;
  onStarGiven?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isAuthenticated,
  isOwnProfile = false,
  onStarGiven
}) => {
  const [isGivingStart, setIsGivingStart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validação da prop profile
  if (!profile) {
    return null;
  }

  const handleGiveStar = async () => {
    try {
      setIsGivingStart(true);
      setError(null);
      await starChainService.giveStar(profile.address);
      if (onStarGiven) {
        onStarGiven();
      }
    } catch (err) {
      setError('Erro ao dar estrela. Tente novamente.');
    } finally {
      setIsGivingStart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
          <p className="text-gray-600 mb-2">{profile.address}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span>
              <span data-testid="stars-count">{profile.stars}</span> estrelas
            </span>
          </div>
          {profile.links?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Links:</h3>
              <ul className="list-disc list-inside">
                {profile.links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <button
            onClick={handleGiveStar}
            disabled={isGivingStart || isOwnProfile}
            className="btn btn-primary"
            data-testid="give-star-button"
          >
            {isGivingStart ? 'Enviando...' : 'Dar Estrela'}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-4 text-red-500" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  );
}; 