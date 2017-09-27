CREATE VIEW [dbo].[issuance_types_v]
AS
select 'AIRCRAFT' as issuance_type
UNION
select 'WAREHOUSE' as issuance_type
UNION
select 'DISPOSAL' as issuance_type
UNION
select 'DIRECTIVE' as issuance_type  

