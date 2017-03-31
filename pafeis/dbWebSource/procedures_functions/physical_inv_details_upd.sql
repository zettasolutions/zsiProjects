
CREATE PROCEDURE [dbo].[physical_inv_details_upd]
(
    @tt    physical_inv_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  physical_inv_id        = b.physical_inv_id
	    ,item_code_id			= b.item_code_id
		,serial_no				= b.serial_no
		,quantity				= b.quantity
		,bin                    = b.bin
		,remarks                = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.physical_inv_details a INNER JOIN @tt b
    ON a.physical_inv_detail_id = b.physical_inv_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y'
  
-- Insert Process
    INSERT INTO dbo.physical_inv_details (
         physical_inv_id 	
	    ,item_code_id
		,serial_no
		,quantity
		,bin
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
         physical_inv_id 	
	    ,item_code_id
		,serial_no
		,quantity
		,bin
	    ,remarks
	    ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE physical_inv_detail_id IS NULL
	  AND physical_inv_id IS NOT NULL
	  AND item_code_id IS NOT NULL
END



