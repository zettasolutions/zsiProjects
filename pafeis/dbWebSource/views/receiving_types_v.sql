CREATE VIEW dbo.receiving_type_v
AS
select 'AIRCRAFT' as receiving_type
UNION
select 'DONATION' as receiving_type
UNION
select 'PROCUREMENT' as receiving_type
UNION
select 'TRANSFER' as receiving_type  
