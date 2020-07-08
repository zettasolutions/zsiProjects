CREATE VIEW dbo.client_contracts_v
AS
SELECT        dbo.client_contracts.client_contract_id, dbo.client_contracts.contract_no, dbo.client_contracts.contract_date, dbo.client_contracts.client_id, dbo.clients.client_name, dbo.client_contracts.is_active, 
                         dbo.client_contracts.contract_term_id, dbo.client_contracts.activation_date, dbo.client_contracts.expiry_date, dbo.client_contracts.plan_id, dbo.client_contracts.plan_qty, dbo.client_contracts.device_model_id, 
                         dbo.client_contracts.device_qty, dbo.client_contracts.device_term_id, dbo.client_contracts.unit_assignment_type_id
FROM            dbo.client_contracts INNER JOIN
                         dbo.clients ON dbo.client_contracts.client_id = dbo.clients.client_id
