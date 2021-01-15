CREATE VIEW dbo.client_contracts_v
AS
SELECT        dbo.client_contracts.client_contract_id, dbo.client_contracts.contract_no, dbo.client_contracts.contract_date, dbo.client_contracts.client_id, dbo.clients.client_name, dbo.client_contracts.is_active, 
                         dbo.client_contracts.contract_term_id, dbo.client_contracts.activation_date, dbo.client_contracts.expiry_date, dbo.client_contracts.plan_id, dbo.client_contracts.plan_qty, dbo.client_contracts.srp_amount, 
                         dbo.client_contracts.dp_amount, dbo.client_contracts.less_dp_amount, dbo.client_contracts.total_amort_amount, dbo.client_contracts.monthly_amort_amount, dbo.clients.client_phone_no, dbo.clients.client_mobile_no, 
                         dbo.clients.client_email_add, dbo.clients.billing_address, dbo.clients.country_id, dbo.clients.state_id, dbo.clients.city_id, dbo.clients.client_tin, dbo.clients.mayor_permit_img, dbo.clients.bir_img, dbo.clients.sec_dti_img, 
                         dbo.users.logon, dbo.users.last_name, dbo.users.first_name, dbo.users.middle_name, dbo.users.name_suffix
FROM            dbo.client_contracts INNER JOIN
                         dbo.clients ON dbo.client_contracts.client_id = dbo.clients.client_id INNER JOIN
                         dbo.users ON dbo.clients.client_id = dbo.users.client_id
