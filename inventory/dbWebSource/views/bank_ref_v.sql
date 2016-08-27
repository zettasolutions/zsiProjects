CREATE VIEW dbo.bank_ref_v
AS
SELECT        bank_ref_id, bank_acctno, bank_acctname, bank_name, acct_amount, depo_pct_share, priority_no, active, created_by, created_date, updated_by, 
                         updated_date
FROM            dbo.bank_ref
