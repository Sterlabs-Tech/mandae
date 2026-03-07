const { Client } = require('pg');

const regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'sa-east-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'ca-central-1'
];

async function testRegions() {
    console.log('Testing regions...');
    for (const region of regions) {
        const connectionString = `postgresql://postgres.ixophuhekwzgtewqryno:NukBOjaexjSnL8xI@aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=disable`;
        const client = new Client({ connectionString, connectionTimeoutMillis: 3000 });

        try {
            await client.connect();
            console.log(`\nSUCCESS! FOUND REGION: ${region}`);
            await client.end();
            return region;
        } catch (e) {
            if (e.message.includes('Tenant or user not found')) {
                process.stdout.write('.'); // Wrong region, pooler works but tenant not here
            } else if (e.code === 'ENOTFOUND' || e.message.includes('timeout')) {
                // Pooler not found or timeout
            } else {
                process.stdout.write('x');
            }
        }
    }
    console.log('\nCould not find region.');
}

testRegions();
