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
-- 03-FEB-17  BD    New
-- 03-FEB-17  GT    Added warehouse_location, organiztion_warehouse
-- ========================================================================

CREATE FUNCTION [dbo].[user_warehouses]
(
   @user_id INT
)
RETURNS @uw TABLE 
(
	warehouse_id INT
   ,warehouse_location nvarchar(50)
   ,organization_warehouse nvarchar(100)
)
AS
BEGIN
   DECLARE @tmpTable TABLE (id INT, warehouse_id INT);
   DECLARE @organization_id   INT;
   DECLARE @warehouse_id      INT;

   SELECT @organization_id = organization_id,
          @warehouse_id    = warehouse_id
     FROM dbo.users 
    WHERE user_id = @user_id;
     
   IF @warehouse_id IS NULL
      BEGIN
		  INSERT INTO @uw
			 SELECT warehouse_id, warehouse_location, concat(dbo.getOrganizationName(wing_id),' ',organization_warehouse) as organization_warehouse
			   FROM warehouses_v 
			  WHERE squadron_id IN (SELECT organization_id 
									  FROM dbo.org_child(@organization_id) 
									);
      END
   ELSE
      BEGIN
		  INSERT INTO @uw 
		  SELECT warehouse_id, warehouse_location, concat(dbo.getOrganizationName(wing_id),' ',organization_warehouse) as organization_warehouse
			   FROM warehouses_v where warehouse_id=@warehouse_id;
	  END

   RETURN

END

