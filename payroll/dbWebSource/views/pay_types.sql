

CREATE VIEW [dbo].[pay_types] as
SELECT  4 as id,  'M' as code, 'MONTHLY'  as description      
UNION
SELECT  3 as id,  'S' as code, 'SEMI-MONTHLY'  as description     
UNION 
SELECT  2 as id,  'W' as code, 'WEEKLY'  as description     
UNION
SELECT  1 as id,  'D' as code, 'DAILY'  as description   
