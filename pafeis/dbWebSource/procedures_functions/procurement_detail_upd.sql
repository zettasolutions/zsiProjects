
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
    SET  item_sequence				= b.item_sequence
		,item_code					= b.item_code
		,item_id					= b.item_id
		,unit_of_measure_id	        = b.unit_of_measure_id
		,quantity					= b.quantity
		,unit_price					= b.unit_price
		,amount						= b.amount
		,total_delivered_quantity	= b.total_delivered_quantity
		,balance_quantity			= b.balance_quantity
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.procurement_detail a INNER JOIN @tt b
    ON a.procurement_detail_id = b.procurement_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y';

-- Insert Process
    INSERT INTO dbo.procurement_detail (
		 item_sequence				
		,item_code					
		,item_id					
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
		 item_sequence				
		,item_code					
		,item_id					
		,unit_of_measure_id	        
		,quantity					
		,unit_price					
		,amount						
		,total_delivered_quantity	
		,balance_quantity	
	    ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE procurement_detail_id IS NULL 
	  AND procurement_id IS NOT NULL;
END




