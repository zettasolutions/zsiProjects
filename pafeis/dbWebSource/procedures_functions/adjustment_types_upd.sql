



CREATE PROCEDURE [dbo].[adjustment_types_upd]
(
    @tt    adjustment_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET adjustment_type		    = b.adjustment_type
		,debit_credit		    = b.debit_credit		
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.adjustment_types a INNER JOIN @tt b
    ON a.adjustment_type_id = b.adjustment_type_id
    WHERE (
			isnull(a.adjustment_type,'')			<> isnull(b.adjustment_type,'')  
			OR isnull(a.debit_credit,'')			<> isnull(b.debit_credit,'')  
		
		
	)
	   
-- Insert Process
    INSERT INTO dbo.adjustment_types (
         adjustment_type
		 ,debit_credit 		
        ,created_by
        ,created_date
        )
    SELECT 
		adjustment_type
        ,debit_credit
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE adjustment_type_id IS NULL
	  AND adjustment_type IS NOT NULL;
END



