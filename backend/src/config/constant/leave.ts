const leave = {
    leaveApplied: 'Leave request submitted successfully.',
    leaveFetched: 'Leave requests fetched successfully.',
    leaveCancelled: 'Leave request cancelled successfully.',
    leaveApproved: 'Leave request approved successfully.',
    leaveRejected: 'Leave request rejected successfully.',
    leaveNotFound: 'Leave request not found.',
    notOwner: 'You are not authorized to modify this leave request.',
    onlyPendingCancel: 'Only pending leave requests can be cancelled.',
    onlyPendingReview: 'Only pending leave requests can be approved or rejected.',
    startDateInPast: 'Start date cannot be in the past.',
    endDateBeforeStart: 'End date must be greater than the start date.',
    overlappingLeave: 'You already have an approved leave that overlaps with these dates.'
};

export default { leave };
