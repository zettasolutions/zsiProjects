CREATE FUNCTION [dbo].[org_child]
(	
	@organization_id INT
)
RETURNS TABLE 
AS
RETURN 
(
WITH MyOrganizations
AS ( SELECT a.organization_id, 
            a.organization_code, 
			a.organization_name, 
			a.organization_pid, 
			a.organization_type_id, 
			b.level_no,
			RIGHT(REPLICATE('0',10)+CAST(a.organization_id AS VARCHAR(MAX)),10) AS hcode
	   FROM dbo.organizations a 
			INNER JOIN dbo.organization_types b ON a.organization_type_id = b.organization_type_id
	  WHERE a.organization_id = @organization_id
	  UNION ALL
	 SELECT org.organization_id, 
	        org.organization_code, 
			org.organization_name, 
			org.organization_pid, 
			org.organization_type_id, 
			typ.level_no,
			MyOrganizations.hcode + '-' + RIGHT(REPLICATE('0',10)+CAST(org.organization_id AS VARCHAR(MAX)),10) AS hcode
	   FROM dbo.organizations org 
			INNER JOIN  dbo.organization_types typ ON org.organization_type_id = typ.organization_type_id
			INNER JOIN MyOrganizations ON org.organization_pid = MyOrganizations.organization_id
	  WHERE org.organization_pid IS NOT NULL )
SELECT *
FROM MyOrganizations
--ORDER BY HCODE
)