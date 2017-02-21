
CREATE PROCEDURE [dbo].[units_conv_upd]
(
    @tt    units_conv_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
SET NOCOUNT ON

    UPDATE a 
        SET  from_unit_id     = b.from_unit_id
			,unit_conv_id     = b.unit_conv_id
			,unit_conv_qty    = b.unit_conv_qty
            ,updated_by		  = @user_id
            ,updated_date	  = GETDATE()
     FROM dbo.units_conv a INNER JOIN @tt b
        ON a.conv_id = b.conv_id 
       WHERE (
				isnull(a.from_unit_id,'') <> isnull(b.from_unit_id,'')   
			OR	isnull(a.unit_conv_id,'') <> isnull(b.unit_conv_id,'')   
			OR  isnull(a.unit_conv_qty,0) <> isnull(b.unit_conv_qty,0)   
	   )

-- Insert Process

    INSERT INTO conv_units (
         from_unit_id
		,unit_conv_id  
		,unit_conv_qty 
        ,created_by
        ,created_date
        )
    SELECT 
        from_unit_id
	   ,unit_conv_id  
	   ,unit_conv_qty 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE conv_id IS NULL
	
END

