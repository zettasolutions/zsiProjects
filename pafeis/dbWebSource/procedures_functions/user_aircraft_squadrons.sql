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

CREATE FUNCTION [dbo].[user_aircraft_squadrons]
(
   @user_id INT
  ,@squadron_type nvarchar(100)
)
RETURNS @us TABLE 
(
	organization_id INT
   ,organization_name nvarchar(50)
)
AS
BEGIN
   DECLARE @organization_id   INT;
   DECLARE @organization_type_code   nvarchar(50);

   SELECT @organization_id = organization_id, @organization_type_code=organization_type_code
     FROM dbo.users_v 
    WHERE user_id = @user_id;

   IF @organization_type_code='SQUADRON'
      SELECT @organization_id=organization_id FROM dbo.org_parent(@organization_id) where organization_type_code='WING'
     
      BEGIN
		  INSERT INTO @us
			 SELECT organization_id, organization_name
			   FROM organizations_v 
			  WHERE squadron_type = @squadron_type and organization_id IN (SELECT organization_id 
									  FROM dbo.org_child(@organization_id) 
									);
      END

   RETURN

END
