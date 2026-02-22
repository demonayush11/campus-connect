// One-time script to sync all existing users' roles based on their admissionYear
// Run: node fix_roles.js
import prisma from './config/db.js';

function computeAcademicYear(admissionYear) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return currentMonth >= 7
        ? currentYear - admissionYear + 1
        : currentYear - admissionYear;
}

async function fixRoles() {
    const users = await prisma.user.findMany({
        where: { admissionYear: { not: null } },
        select: { id: true, email: true, admissionYear: true, role: true },
    });

    console.log(`Found ${users.length} users with admissionYear set`);

    for (const u of users) {
        const ay = computeAcademicYear(u.admissionYear);
        const expectedRole = ay >= 3 ? 'senior' : 'junior';
        if (u.role !== expectedRole) {
            await prisma.user.update({
                where: { id: u.id },
                data: { role: expectedRole },
            });
            console.log(`✅ ${u.email}: ${u.role} → ${expectedRole} (Year ${ay})`);
        } else {
            console.log(`✓  ${u.email}: already ${u.role} (Year ${ay})`);
        }
    }

    await prisma.$disconnect();
    console.log('\nDone!');
}

fixRoles().catch(console.error);
