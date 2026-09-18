import { Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';

/**
 * Calculate profile completion percentage based on filled fields
 */
function calculateProfileCompletion(user: any): number {
  let score = 20; // Base score for registration (name + email)

  if (user.phone && user.phone.trim().length > 0) score += 10;
  if (user.location && user.location.trim().length > 0) score += 10;
  if (user.headline && user.headline.trim().length > 0) score += 15;
  if (user.bio && user.bio.trim().length > 0) score += 15;
  if (user.skills && user.skills.length > 0) score += 15;
  if (user.education && user.education.length > 0) score += 10;
  if (user.experience && user.experience.length > 0) score += 5;

  return Math.min(100, score);
}

/**
 * Get User Profile
 * GET /api/users/profile
 */
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const user = await DB.findUserById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { password, ...safeUser } = user;
    const completionPercentage = calculateProfileCompletion(safeUser);

    res.json({
      success: true,
      user: {
        ...safeUser,
        profileCompletion: completionPercentage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}

/**
 * Update User Profile
 * PUT /api/users/profile
 */
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { name, phone, location, headline, bio, skills, education, experience } = req.body;

    const updated = await DB.updateUser(req.user._id, {
      ...(name ? { name: name.trim() } : {}),
      phone,
      location,
      headline,
      bio,
      skills: Array.isArray(skills) ? skills : [],
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { password, ...safeUser } = updated;
    const completionPercentage = calculateProfileCompletion(safeUser);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        ...safeUser,
        profileCompletion: completionPercentage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}
