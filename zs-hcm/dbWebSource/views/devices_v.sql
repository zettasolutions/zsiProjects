

CREATE VIEW [dbo].[devices_v] AS
SELECT * FROM zsi_crm.dbo.devices where not isnull(client_id,0)<0 
