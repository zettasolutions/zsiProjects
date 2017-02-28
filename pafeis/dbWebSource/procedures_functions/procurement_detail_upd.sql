

-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: February 24, 2017 11:56 PM
-- Description:	Procurement details insert and update records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[procurement_detail_upd]
(
    @tt    procurement_detail_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_no				    = b.item_no
		,item_code_id				= b.item_code_id
		,unit_of_measure_id	        = b.unit_of_measure_id
		,quantity					= b.quantity
		,unit_price					= b.unit_price
		,amount						= b.amount
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.procurement_detail a INNER JOIN @tt b
    ON a.procurement_detail_id = b.procurement_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y';

-- Insert Process
    INSERT INTO dbo.procurement_detail (
		 item_no				
		,item_code_id					
		,unit_of_measure_id	        
		,quantity					
		,unit_price					
		,amount						
		,total_delivered_quantity	
		,balance_quantity			
		,created_by
        ,created_date
        )
    SELECT 
		 item_no				
		,item_code_id					
		,unit_of_measure_id	        
		,quantity					
		,unit_price					
		,amount						
		,0	
		,quantity	
	    ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE procurement_detail_id IS NULL 
	  AND procurement_id IS NOT NULL
	  AND item_code_id IS NOT NULL
	  AND quantity > 0

END





