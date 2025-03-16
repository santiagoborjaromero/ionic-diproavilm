import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it("Inicializar", () => {
        let comp = TestBed.createComponent(LoginPage);
        let func = comp.componentInstance.initial();
        expect(comp.componentInstance.username).toEqual("");
    })

    it('Evaluar Login', () => {
        let comp = TestBed.createComponent(LoginPage);
        let username = comp.componentInstance.username;
        let password = comp.componentInstance.password;

        username = "santiago";
        password = "S13mpr3.88884542@@";

        const btnElement = fixture.debugElement.query(By.css('ion-button#send'));
        btnElement.nativeElement.click();

        expect(comp.componentInstance.user).not.toBeNull();

    });
});

