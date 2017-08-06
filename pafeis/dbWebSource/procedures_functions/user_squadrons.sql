-- ========================================================================
-- 
-- Copyright (c) 2016-2017 ZettaSolutions, Inc.  All rights reserved.
-- 
-- Redistribution and use in source and binary forms, with or without
-- modification is strictly prohibited.
--
-- ************************************************************************
--
-- Modification History
-- Date       By    History
-- ---------  ----  -------------------------------------------------------
-- 17-FEB-17  GT    New
-- ========================================================================

CREATE FUNCTION [dbo].[user_squadrons]
(
   @user_id INT
  ,@organization_type_code nvarchar(100)
  ,@squadron_type nvarchar(100)=null
  ,@organization_id INT=NULL
  
)
RETURNS @us TABLE 
(
	organization_id INT
   ,organization_name nvarchar(150)
)
AS
BEGIN
   DECLARE @user_organization_id   INT;
   DECLARE @user_organization_type_code   nvarchar(100);
   IF ISNULL(@organization_id,0) = 0
     SELECT @user_organization_id = organization_id,@user_organization_type_code=organization_type_code FROM dbo.users_v WHERE user_id = @user_id;
   ELSE
     SET @user_organization_id=@organization_id

   IF ISNULL(@squadron_type,'') <> ''
	  INSERT INTO @us
			 SELECT organization_id, concat(dbo.getOrganizationName(organization_pid),' ', organization_name) as organization_name
			   FROM organizations_v 
			  WHERE squadron_type = @squadron_type and organization_id IN (SELECT organization_id FROM dbo.org_child(@user_organization_id));

	ELSE
	BEGIN
	IF @user_organization_type_code='SQUADRON'
			  INSERT INTO @us
			 SELECT organization_id, concat(dbo.getOrganizationName(organization_pid),' ', organization_name) as organization_name
			   FROM organizations_v 
			  WHERE organization_type_code=@organization_type_code and organization_id IN (SELECT organization_id FROM dbo.org_parent(@user_organization_id));
    ELSE
		  INSERT INTO @us
			 SELECT organization_id, concat(dbo.getOrganizationName(organization_pid),' ', organization_name) as organization_name
			   FROM organizations_v 
			  WHERE organization_type_code=@organization_type_code and organization_id IN (SELECT organization_id FROM dbo.org_child(@user_organization_id));

   END
   RETURN

END

