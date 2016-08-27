
CREATE PROCEDURE [dbo].[bank_ref_upd]
(
    @tt    bank_ref_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process

    UPDATE a 
        SET 
			 bank_acctno		= b.bank_acctno
			,bank_acctname	    = b.bank_acctname
			,bank_name			= b.bank_name
			,acct_amount		= b.acct_amount
			,depo_pct_share		= b.depo_pct_share
			,priority_no		= b.priority_no
			,active				= b.active
            ,updated_by			= @user_id
            ,updated_date		= GETDATE()
     FROM dbo.bank_ref a INNER JOIN @tt b
        ON a.bank_ref_id = b.bank_ref_id 
		
       WHERE (
				
				isnull(a.bank_acctno,'')		 <> isnull(b.bank_acctno,'')   
			OR	isnull(a.bank_acctname,'')		 <> isnull(b.bank_acctname,'')   
			OR	isnull(a.bank_name,'')			 <> isnull(b.bank_name,'')   
			OR	isnull(a.acct_amount,0)			<> isnull(b.acct_amount,0)   
			OR	isnull(a.depo_pct_share,0)		<> isnull(b.depo_pct_share,0)   
			OR	isnull(a.priority_no,0)			<> isnull(b.priority_no,0)    
			OR	isnull(a.active,'')				 <> isnull(b.active,'')
	   )
	   

-- Insert Process

    INSERT INTO bank_ref(
		 bank_acctno	
		,bank_acctname	
		,bank_name		
		,acct_amount		
		,depo_pct_share			
		,priority_no	
		,active	
		,created_by
        ,created_date
        )
    SELECT 
         bank_acctno	
		,bank_acctname	
		,bank_name		
		,acct_amount		
		,depo_pct_share			
		,priority_no	
		,active		
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE bank_ref_id IS NULL


END






