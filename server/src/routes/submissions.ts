import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/submissions - Admin sees all, developer sees own
router.get('/', authenticate, requireRole('ADMIN', 'DEVELOPER'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  let submissions = [...db.submissions];

  if (user.role !== 'ADMIN') {
    submissions = submissions.filter(s => s.developerId === user.id);
  }

  // Enrich with project info
  const enriched = submissions.map(s => {
    const project = db.projects.find(p => p.id === s.projectId);
    return {
      ...s,
      projectTitle: project?.title || 'Unknown Project',
      projectCategory: project?.category || 'General',
      projectSlug: project?.slug || '',
      currentProjectStatus: project?.status || 'UNKNOWN'
    };
  });

  res.json({ submissions: enriched });
});

// POST /api/submissions/:id/review - Admin approve, reject, or request changes
router.post('/:id/review', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const { status, adminFeedback } = req.body; // status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'

  if (!status || !['APPROVED', 'REJECTED', 'CHANGES_REQUESTED'].includes(status)) {
    res.status(400).json({ error: 'Valid review status (APPROVED, REJECTED, CHANGES_REQUESTED) is required.' });
    return;
  }

  if (status === 'REJECTED' && (!adminFeedback || !adminFeedback.trim())) {
    res.status(400).json({ error: 'Please provide a clear reason when rejecting a submission.' });
    return;
  }

  const submission = db.submissions.find(s => s.id === id);
  if (!submission) {
    res.status(404).json({ error: 'Submission not found' });
    return;
  }

  submission.status = status;
  submission.adminFeedback = adminFeedback || '';
  submission.reviewedBy = user.name;
  submission.reviewedAt = new Date().toISOString();

  const project = db.projects.find(p => p.id === submission.projectId);
  if (project) {
    if (status === 'APPROVED') {
      project.status = 'PUBLISHED';
    } else if (status === 'REJECTED') {
      project.status = 'REJECTED';
    } else if (status === 'CHANGES_REQUESTED') {
      project.status = 'DRAFT';
    }
    project.updatedAt = new Date().toISOString();
  }

  // Notify developer
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: submission.developerId,
    title: status === 'APPROVED' ? 'Project Approved!' : status === 'REJECTED' ? 'Submission Update: Rejected' : 'Changes Requested',
    message: status === 'APPROVED'
      ? `Your project "${project?.title}" was approved by Admin and is now live!`
      : `Admin review for "${project?.title}": ${adminFeedback}`,
    type: status === 'APPROVED' ? 'approval' : 'rejection',
    link: project ? `/projects/${project.slug}` : undefined,
    read: false,
    createdAt: new Date().toISOString()
  });

  db.logActivity(user.id, user.name, 'SUBMISSION_REVIEWED', `Reviewed submission for "${project?.title || id}": ${status}`);
  db.save();

  res.json({
    message: `Submission marked as ${status}`,
    submission
  });
});

export default router;
