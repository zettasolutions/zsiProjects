
CREATE PROCEDURE [dbo].[deductions_ref_upd]
(
    @tt    deductions_ref_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET deduction_code			= b.deduction_code
			,deduction_desc			= b.deduction_desc
			,deduction_pct			= b.deduction_pct
			,default_amt			= b.default_amt
			,updated_by				= @user_id
            ,updated_date			= GETDATE()
     FROM dbo.deductions_ref a INNER JOIN @tt b
        ON a.deduction_ref_id = b.deduction_ref_id 
       WHERE (
				isnull(a.deduction_code,'')				<> isnull(b.deduction_code,'')   
			OR	isnull(a.deduction_desc,'')				<> isnull(b.deduction_desc,'')   
			OR	isnull(a.deduction_pct,0)				 <> isnull(b.deduction_pct,0) 
			OR	isnull(a.default_amt,0)					 <> isnull(b.default_amt,0) 
			
	   )

 

-- Insert Process

    INSERT INTO deductions_ref(
       
		 deduction_code
		,deduction_desc 
		,deduction_pct  
		,default_amt
        ,created_by
        ,created_date
		
        )
    SELECT 
       
		 deduction_code
		,deduction_desc 
		,deduction_pct  
		,default_amt		
		,@user_id  
		,GETDATE()
       
       
    FROM @tt
    WHERE deduction_ref_id IS NULL
	 
END





