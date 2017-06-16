
CREATE VIEW [dbo].[receiving_types_v]
AS
select 'AIRCRAFT' as receiving_type
UNION
select 'DIRECTIVE' as receiving_type
UNION
select 'DONATION' as receiving_type
UNION
select 'PROCUREMENT' as receiving_type
UNION
select 'WAREHOUSE' as receiving_type  

