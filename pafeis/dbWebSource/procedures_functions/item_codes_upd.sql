
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 7, 2016 7:06PM
-- Description:	Item codes select all or by id record(s).
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================
CREATE PROCEDURE [dbo].[item_codes_upd]
(
    @tt    item_codes_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_type_id		    = b.item_type_id
		,part_no  			    = b.part_no
		,national_stock_no		= b.national_stock_no
		,item_name				= b.item_name
		,critical_level         = b.critical_level
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_codes a INNER JOIN @tt b
    ON a.item_code_id = b.item_code_id
    WHERE (
			isnull(a.item_type_id,0)		<> isnull(b.item_type_id,0)  
		OR	isnull(a.part_no,'')			<> isnull(b.part_no,'')  
		OR	isnull(a.national_stock_no,'')	<> isnull(b.national_stock_no,'') 
		OR	isnull(a.item_name,'')			<> isnull(b.item_name,'') 
		OR	isnull(a.critical_level,0)		<> isnull(b.critical_level,0) 
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.item_codes (
         item_type_id 
		,part_no
		,national_stock_no
		,item_name
		,critical_level
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        item_type_id 
	   ,part_no	
	   ,national_stock_no
	   ,item_name
	   ,critical_level
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_code_id IS NULL;
END

