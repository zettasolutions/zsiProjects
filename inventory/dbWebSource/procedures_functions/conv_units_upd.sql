CREATE PROCEDURE [dbo].[conv_units_upd]
(
    @tt    conv_units_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
SET NOCOUNT ON

    UPDATE a 
        SET  from_unit_id     = b.from_unit_id
			,conv_unit_id     = b.conv_unit_id
			,conv_unit_qty    = b.conv_unit_qty
            ,updated_by		  = @user_id
            ,updated_date	  = GETDATE()
     FROM dbo.conv_units a INNER JOIN @tt b
        ON a.conv_id = b.conv_id 
       WHERE (
				isnull(a.from_unit_id,'') <> isnull(b.from_unit_id,'')   
			OR	isnull(a.conv_unit_id,'') <> isnull(b.conv_unit_id,'')   
			OR  isnull(a.conv_unit_qty,0) <> isnull(b.conv_unit_qty,0)   
	   )

-- Insert Process

    INSERT INTO conv_units (
         from_unit_id
		,conv_unit_id  
		,conv_unit_qty 
        ,created_by
        ,created_date
        )
    SELECT 
        from_unit_id
	   ,conv_unit_id  
	   ,conv_unit_qty 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE conv_id IS NULL
	
END
