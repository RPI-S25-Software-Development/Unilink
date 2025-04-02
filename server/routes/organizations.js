const express = require('express');
const crypto = require('crypto');
const pool = require('../db')
const router = express.Router();

// GET all organizations
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.organizations");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET org data associated with a specfic org id
router.get('/orgId/:orgId', async (req, res) => {
    try {
        const result = await pool.query(`select * from unilink.organizations where organization_id='${req.params.orgId}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET org data associated with a specfic org name
// WARNING: May return multiple results if there is a duplicate name
router.get('/orgName/:orgName', async (req, res) => {
    try {
        const result = await pool.query(`select * from unilink.organizations where organization_name='${req.params.orgName}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE A NEW ORGANIZATION
router.post('/', async (req, res) => {
    // Generate random UUID
    const organization_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const organization_name = req.body['organization_name'];
        const organization_bio = req.body['organization_bio'];
        const organization_address = req.body['organization_address'];
        const university_id = req.body['university_id'];

        const query = `insert into unilink.organizations(organization_id, organization_name,
        organization_bio, organization_address, university_id) VALUES($1, $2, $3, $4, $5)`;
        try {
            const result = await pool.query(query, [organization_id, organization_name,
                organization_bio, organization_address, university_id]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// EDIT AN EXISTING ORG
router.put('/orgId/:orgId', async (req, res) => {
    // Pull params from request body
    try {
        const organization_name = req.body['organization_name'];
        const organization_bio = req.body['organization_bio'];
        const organization_address = req.body['organization_address'];
        const university_id = req.body['university_id'];

        const query = `update unilink.organizations set organization_name=$1, organization_bio=$2,
        organization_address=$3, university_id=$4 where organization_id=$5`;
        try {
            const result = await pool.query(query, [organization_name, organization_bio,
                organization_address, university_id, req.params.orgId]);
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// DELETE AN EXISTING ORG
router.delete('/orgId/:orgId', async (req, res) => {
    const query = `delete from unilink.organizations where organization_id=$1`;
    try {
        const result = await pool.query(query, [req.params.orgId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;