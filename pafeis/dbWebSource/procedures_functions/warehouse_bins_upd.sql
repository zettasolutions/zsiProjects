
CREATE PROCEDURE [dbo].[warehouse_bins_upd]
(
    @tt    warehouse_bins_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  bin_code  		= b.bin_code 
		,is_active		= b.is_active
        ,updated_by		= @user_id
        ,updated_date	= GETDATE()
    FROM dbo.warehouse_bins a INNER JOIN @tt b
    ON a.bin_id = b.bin_id
    WHERE isnull(b.is_edited,'N')='Y'

	   
-- Insert Process
    INSERT INTO dbo.warehouse_bins (
		 warehouse_id
        ,bin_code 
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    warehouse_id
       ,bin_code 
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE bin_id IS NULL
	  AND bin_code IS NOT NULL
	  AND warehouse_id IS NOT NULL;
END



