
CREATE PROCEDURE [dbo].[adjustment_details_upd]
(
    @tt    adjustment_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  adjustment_type_id     = b.adjustment_type_id
	    ,item_inv_id			= b.item_inv_id
		,serial_no              = b.serial_no
		,item_status_id         = b.item_status_id
		,adjustment_qty			= b.adjustment_qty
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.adjustment_details a INNER JOIN @tt b
    ON a.adjustment_detail_id = b.adjustment_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y'
  
-- Insert Process
    INSERT INTO dbo.adjustment_details (
         adjustment_id 
	    ,adjustment_type_id		
	    ,item_inv_id
		,serial_no
		,item_status_id
		,adjustment_qty
		,created_by
        ,created_date
        )
    SELECT 
        adjustment_id 
	   ,adjustment_type_id
	   ,item_inv_id
	   ,serial_no
	   ,item_status_id
	   ,adjustment_qty
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE adjustment_detail_id IS NULL
	  AND adjustment_id IS NOT NULL
	  AND item_inv_id IS NOT NULL
END



